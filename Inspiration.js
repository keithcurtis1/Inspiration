on('chat:message', (msg) => {
            
    //const version = '0.0.2';
            
    if ('api' === msg.type && /!inspire\b/i.test(msg.content) && msg.selected) {
        log(msg);
        //get parameter
        let cardAction = msg.content.split(" --")[1];


        //getid of deck
        var inspirationDeck = findObjs({
            _type: "deck",
            name: "Inspiration",
        })[0];

        //test if deck exists
        if (inspirationDeck) {

            var deckID = inspirationDeck.get("_id");

            //get id of card
            let cardid = drawCard(deckID);

            // get playerId of Token controller
            //assign selected token to a variable
            let token = getObj(msg.selected[0]._type, msg.selected[0]._id);

            //assign associated character to a variable
            if (token.get('represents')) {
                let character = getObj("character", token.get('represents'));

                //Get owner IDs of each
                tokenOwner = (token.get('controlledby').split(',')[0]);
                characterOwner = (character.get('controlledby').split(',')[0]);
                // If the token represents a character, get the character's controller, otherwise the token's
                let ownerid = (token.get('controlledby').split(',')[0]);

                if (character) {
                    ownerid = (character.get('controlledby').split(',')[0]);
                }
                // give card to player
                if (ownerid !== 'all') {

                    switch (cardAction) {
                        case 'give':
                            giveCardToPlayer(cardid, ownerid);
                            break;
                        case 'take':
                            takeCardFromPlayer(ownerid, cardid);
                            break;
                        default:
                    sendChat('Inspire', '/w gm '+cardAction+' is not a valid parameter Please use --give or --take.');
                                                break;

                    }

                } else {
                    sendChat('Inspire', '/w gm If a token is controlled by All Players, an individual player must be specified as first in the list.');
                }
            } else {
                sendChat('Inspire', '/w gm This token does not represent a player. Only players get Inspiration.');
            }
        } else {
            sendChat('Inspire', '/w gm Create a deck named Inspiration.It must be an infinite deck of one card only.');
        }
    }
});
