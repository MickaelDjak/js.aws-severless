import createError from 'http-errors';
import commonMW from './../lib/commonMidleware';
import getEndedAuction from "../lib/getEndedAuction";
import closeAuction from "../lib/closeAuction";

async function placeBid(event, context) {
    try {
        const auctionToClose = await getEndedAuction();
        const closePromises = auctionToClose.map(auction => closeAuction(auction))
        const result = await Promise.all(closePromises);

        return {closed: result.length};

    } catch (error) {
        console.log(error)
        return createError.InternalServerError(error);
    }
}

export const handler = commonMW(placeBid);


