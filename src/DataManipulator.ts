import { ServerRespond } from './DataStreamer';

export interface Row {
	price_abc: number;
	price_def: number;
	upper_bound: number;
	lower_bound: number;
	ratio: number;
	trigger_alert: number | undefined;
	timestamp: Date;
}


export class DataManipulator {
	static generateRow(serverRespond: ServerRespond[]): Row {
		const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
		const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
		const ratio = priceABC / priceDEF;
		const upperbound = 1 + 0.1 * ratio;
		const lowerbound = 1 - 0.1 * ratio;
		return {
			price_abc: priceABC,
			price_def: priceDEF,
			upper_bound: upperbound,
			lower_bound: lowerbound,
			ratio,
			trigger_alert: ratio > upperbound || ratio < lowerbound ? ratio : undefined,
			timestamp:
				serverRespond[0].timestamp > serverRespond[1].timestamp
					? serverRespond[0].timestamp
					: serverRespond[1].timestamp
		};
	}
}
