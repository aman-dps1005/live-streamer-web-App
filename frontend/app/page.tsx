import SendLinkcard from "./sendingLink/page";
import{redirect} from "next/navigation"

export default function Home() {
  redirect('/sendingLink');
}
