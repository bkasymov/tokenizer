// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dpenney42 is ERC20, Ownable {
    constructor(uint256 initialSupply)
        ERC20("Dpenney42", "DP42")
        Ownable(msg.sender)
    {
        // initilaze how many tokens we are creating. *10^18 because we are using 18 decimals. In crypto does not use floats.
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
    
    // this function is used to create new tokens. Only the owner can call this function. At the same time owner could write any address to receive new tokens.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // this function is used to burn tokens. Any user can call this function to burn their own tokens.
    function burn(uint256 amount) public  {
        _burn(msg.sender, amount);
    }

}