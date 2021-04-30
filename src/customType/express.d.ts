export declare global {
	namespace Express {
		interface Request {
			newAccessToken?: string;
			user_email?: string;
		}
	}
}
