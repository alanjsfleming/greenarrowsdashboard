import { auth } from "../firebase";

export default async function useTeamRole(): Promise<boolean> {
    await auth.currentUser?.getIdTokenResult(true);
    const decodedToken = await auth.currentUser?.getIdTokenResult();

    return decodedToken?.claims?.stripeRole ? true : false;
}