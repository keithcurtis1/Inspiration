on('chat:message', (msg) => {
    if ('api' === msg.type && /!inspire\b/i.test(msg.content) && msg.selected) {
        //        log(msg);
        //get parameter and use default of 'give' if parameter is missing or malformed
        let cardAction = msg.content.split(/\s+--/)[1];
        if ((cardAction !== "give" && cardAction !== "take") || cardAction === false) {
            cardAction = 'give';
        }
        //getid of deck
        let inspirationDeck = findObjs({
            _type: "deck",
            name: "Inspiration"
        })[0];

        //test if deck exists
        if (inspirationDeck) {

            let deckID = inspirationDeck.id;
            // Necessary to shuffle at least once after deck creation because of Roll20 Deck bug
            shuffleDeck(deckID);
            //get id of card
            let cardid = drawCard(deckID);

            // get playerId of Token controller
            //assign selected token to a variable

            log('number of tokens selected is ' + msg.selected.length);
            if (msg.selected.length <= 1) {

                let token = getObj(msg.selected[0]._type, msg.selected[0]._id);

                //assign associated character to a variable
                if (token.get('represents')) {
                    let character = getObj("character", token.get('represents'));

                    //Get owner IDs of each -- Not needed at this point
                    //tokenOwner = (token.get('controlledby').split(',')[0]);
                    //characterOwner = (character.get('controlledby').split(',')[0]);
                    // If the token represents a character, get the character's controller, otherwise the token's
                    let ownerids = (token.get('controlledby').split(','));


                    if (character) {
                        ownerids = (character.get('controlledby').split(','));
                    }
                    //reduces to one ownerid that is not ['all']
                    ownerid = ownerids.filter(s => s !== 'all')[0];


                    // give card to player
                    // If the ownerid is undefined (no valid controller) perform the transaction
                    if (ownerid) {

                        switch (cardAction) {
                            case 'take':
                                takeCardFromPlayer(ownerid, {
                                    cardid: cardid
                                });
                                break;
                            default:
                                giveCardToPlayer(cardid, ownerid);
                                break;

                        }

                    } else {

                        sendChat('Inspire', '/w gm If a token represents a character controlled by \'All Players\', an individual player must be also be specified. If there are multiple controllers, only the first will get inspiration.');
                    }
                } else {
                    sendChat('Inspire', '/w gm This token does not represent a player character. Only players get Inspiration.');
                }
            } else {
                sendChat('Inspire', '/w gm Please select only one token. It must represent player-controlled character.');
            }
        } else {
            sendChat('Inspire', '/w gm Create a deck named Inspiration.It must be an infinite deck of one card only.');
        }
    }
});
