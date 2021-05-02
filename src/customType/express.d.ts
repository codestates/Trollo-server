export declare global {
	namespace Express {
		interface Request {
			newAccessToken?: string;
			user_id?: number | undefined;
			user_email?: string | undefined;
		}
	}
}
