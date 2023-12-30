// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Migrations {
    // Adresse du proprietaire du contrat
    address public owner = msg.sender;
    // Derniere migration completee
    uint public last_completed_migration;

    // Modificateur restreint
    modifier restricted() {
        // Verifie que l'appelant est le proprietaire du contrat
        require(
            msg.sender == owner,
            "Cette fonction est reservee au proprietaire du contrat"
        );
        _;
    }

    // Constructeur pour definir le proprietaire initial comme l'expediteur de la creation du contrat
    constructor() {
        owner = msg.sender;
    }

    // Fonction pour mettre a niveau le contrat a une nouvelle adresse
    function upgrade(address new_address) public restricted {
        // Cree une instance du contrat mis a niveau a une nouvelle adresse
        Migrations upgraded = Migrations(new_address);
        // Definit la migration completee du contrat mis a niveau
        upgraded.setCompleted(last_completed_migration);
    }

    // Fonction pour definir la migration completee
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
}
