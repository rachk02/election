const Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  let electionInstance;

  before(async function() {
    // Initialisation avant tous les tests
    electionInstance = await Election.deployed();
  });

  it("initialise avec deux candidats", async function() {
    // Vérifie que le contrat est initialisé avec deux candidats
    const count = await electionInstance.candidatesCount();
    assert.equal(count, 2, "Le contrat n'a pas été initialisé avec deux candidats");
  });

  it("initialise les candidats avec les valeurs correctes", async function() {
    // Vérifie que les candidats sont initialisés avec les bonnes valeurs
    let candidate = await electionInstance.candidates(1);
    assert.equal(candidate[0], 1, "contient le bon identifiant");
    assert.equal(candidate[1], "Diane", "contient le bon nom");
    assert.equal(candidate[2].toNumber(), 0, "contient le bon nombre de votes");

    candidate = await electionInstance.candidates(2);
    assert.equal(candidate[0], 2, "contient le bon identifiant");
    assert.equal(candidate[1], "Lati", "contient le bon nom");
    assert.equal(candidate[2].toNumber(), 0, "contient le bon nombre de votes");
  });

  it("permet à un électeur de voter", async function() {
    // Permet à un électeur de voter
    const candidateId = 1;
    const receipt = await electionInstance.vote(candidateId, { from: accounts[0] });

    assert.equal(receipt.logs.length, 1, "un événement a été déclenché");
    assert.equal(receipt.logs[0].event, "VotedEvent", "le type d'événement est correct");
    assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "l'identifiant du candidat est correct");

    const voted = await electionInstance.voters(accounts[0]);
    assert(voted, "l'électeur a été marqué comme ayant voté");

    const candidate = await electionInstance.candidates(candidateId);
    const voteCount = candidate[2].toNumber();
    assert.equal(voteCount, 1, "incrémente le nombre de votes du candidat");
  });

  it("lève une exception pour des candidats invalides", async function() {
    // Lève une exception pour des candidats invalides
    try {
      await electionInstance.vote(99, { from: accounts[1] });
      assert.fail("Une exception était attendue mais aucune n'a été levée");
    } catch (error) {
      assert(error.message.indexOf("revert") >= 0, "le message d'erreur doit contenir revert");

      const candidate1 = await electionInstance.candidates(1);
      const voteCount1 = candidate1[2].toNumber();
      assert.equal(voteCount1, 1, "le candidat 1 n'a reçu aucun vote");

      const candidate2 = await electionInstance.candidates(2);
      const voteCount2 = candidate2[2].toNumber();
      assert.equal(voteCount2, 0, "le candidat 2 n'a reçu aucun vote");
    }
  });

  it("lève une exception pour un double vote", async function() {
    // Lève une exception pour un double vote
    const candidateId = 2;

    await electionInstance.vote(candidateId, { from: accounts[1] });
    const candidate = await electionInstance.candidates(candidateId);
    let voteCount = candidate[2].toNumber();
    assert.equal(voteCount, 1, "accepte le premier vote");

    try {
      await electionInstance.vote(candidateId, { from: accounts[1] });
      assert.fail("Une exception était attendue mais aucune n'a été levée");
    } catch (error) {
      assert(error.message.indexOf("revert") >= 0, "le message d'erreur doit contenir revert");

      const candidate1 = await electionInstance.candidates(1);
      const voteCount1 = candidate1[2].toNumber();
      assert.equal(voteCount1, 1, "le candidat 1 n'a reçu aucun vote");

      const candidate2 = await electionInstance.candidates(2);
      voteCount = candidate2[2].toNumber();
      assert.equal(voteCount, 1, "le candidat 2 n'a reçu aucun vote");
    }
  });
});
