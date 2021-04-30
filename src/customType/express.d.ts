export declare global {
	namespace Express {
		interface Request {
			newAccessToken?: string;
		}
	}
}
