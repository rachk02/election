App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // Si une instance web3 est déjà fournie par MetaMask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Spécifier une instance par défaut si aucune instance web3 n'est fournie
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instancier un nouveau contrat Truffle à partir de l'artefact
      App.contracts.Election = TruffleContract(election);
      // Connecter le fournisseur pour interagir avec le contrat
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Ecouter les événements émis par le contrat
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Redémarrer Chrome si vous ne parvenez pas à recevoir cet événement
      // Il s'agit d'un problème connu avec Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.VotedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).on('data', function(event) {
        console.log("événement déclenché", event);
        // Recharger lorsque qu'un nouveau vote est enregistré
        App.render();
      }).on('error', console.error);
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Charger les données du compte
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Votre compte : " + account);
      }
    });

    // Charger les données du contrat
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        App.renderCandidate(electionInstance, i);
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Ne pas autoriser un utilisateur à voter
      if (hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  renderCandidate: function(instance, i) {
    instance.candidates(i).then(function(candidate) {
      var id = candidate[0];
      var name = candidate[1];
      var voteCount = candidate[2];

      // Rendre le résultat du candidat
      var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
      $("#candidatesResults").append(candidateTemplate);

      // Rendre l'option de vote pour le candidat
      var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
      $('#candidatesSelect').append(candidateOption);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Attendre la mise a jour des votes
      $("#content").hide();
      $("#loader").show();
  
      // Rafraichir la page apres un vote reussi
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  }
  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
