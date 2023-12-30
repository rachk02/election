// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Election {
    // Modèle d'un candidat
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Stocker les comptes qui ont voté
    mapping(address => bool) public voters;
    // Stocker les candidats
    mapping(uint => Candidate) public candidates;
    // Stocker le nombre de candidats
    uint public candidatesCount;

    // Événement de vote
    event VotedEvent (
        uint indexed _candidateId
    );

    // Constructeur pour initialiser les candidats
    constructor() {
        addCandidate("Diane");
        addCandidate("Lati");
    }

    // Fonction pour ajouter un candidat
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Fonction pour voter
    function vote(uint _candidateId) public {
        // Exiger que l'électeur n'ait pas déjà voté
        require(!voters[msg.sender], "Vous avez deja voter.");

        // Exiger un candidat valide
        require(_candidateId > 0 && _candidateId <= candidatesCount, "ID de candidat invalide.");

        // Enregistrer que l'électeur a voté
        voters[msg.sender] = true;

        // Mettre à jour le nombre de votes du candidat
        candidates[_candidateId].voteCount++;

        // Déclencher l'événement de vote
        emit VotedEvent(_candidateId);
    }
}
