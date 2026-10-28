import { buildInvitationViewModel, type InvitationViewModelProps } from "../invitation-v2/viewModel";
import { Backdrop } from "./components/Backdrop";
import HeroSection from "./sections/HeroSection";
import GreetingSection from "./sections/GreetingSection";
import FamilySection from "./sections/FamilySection";
import CountdownSection from "./sections/CountdownSection";
import CeremonySection from "./sections/CeremonySection";
import TableSection from "./sections/TableSection";
import GallerySection from "./sections/GallerySection";
import RsvpBlock from "./sections/RsvpBlock";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";

import "./invitation-v3.css";

/**
 * Crimson Unveil. Same section order as the other designs:
 * hero -> greeting -> parents -> countdown -> ceremony -> your table -> gallery -> RSVP -> contact -> footer.
 * The cover envelope, background music, petals and smooth scrolling are provided by
 * PublicInvitationPage (as for Photo Story), so this component only renders the content.
 * Fonts come from the --t-heading / --t-body variables set by the typography picker.
 */
export default function CrimsonInvitation(props: InvitationViewModelProps) {
  const invitation = buildInvitationViewModel(props);
  const { guest, eventToken, tableInfo } = props;

  return (
    <div className="inv3-root">
      <Backdrop />
      <main className="inv3-main">
        <HeroSection invitation={invitation} showFindTable={!!tableInfo?.enabled} />
        <GreetingSection guestName={guest?.guest_name} />
        <FamilySection invitation={invitation} />
        <CountdownSection invitation={invitation} />
        <CeremonySection events={invitation.ceremony_events} />
        <TableSection tableInfo={tableInfo} />
        <GallerySection photos={invitation.gallery_photos.map((p) => p.photo_path)} />
        <RsvpBlock invitation={invitation} guest={guest} eventToken={eventToken} />
        <ContactSection invitation={invitation} />
        <FooterSection invitation={invitation} />
      </main>
    </div>
  );
}
