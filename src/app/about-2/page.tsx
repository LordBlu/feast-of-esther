import { permanentRedirect } from 'next/navigation';

/** Legacy URL — About Us lives at `/about`. */
export default function About2RedirectPage() {
  permanentRedirect('/about');
}
