import { buildInvitationViewModel, type InvitationViewModelProps } from "../invitation-v2/viewModel";
import { PearlDecor } from "./components/PearlDecor";
import HeroSection from "./sections/HeroSection";
import GreetingSection from "./sections/GreetingSection";
import FamilySection from "./sections/FamilySection";
import CountdownSection from "./sections/CountdownSection";
import CeremonySection from "./sections/CeremonySection";
import TableSection from "./sections/TableSection";
import GallerySection from "./sections/GallerySection";
import LineupSection from "./sections/LineupSection";
import RsvpBlock from "./sections/RsvpBlock";
import NoteSection from "./sections/NoteSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";

import "./invitation-v4.css";

/**
 * Silver Pearl. Same section order as the other designs, plus a lineup and a note:
 * hero -> greeting -> parents -> countdown -> ceremony -> your table -> gallery -> lineup -> RSVP -> note -> contact -> footer.
 * The cover card, background music and smooth scrolling are provided by PublicInvitationPage.
 * Fonts come from the --t-heading / --t-body variables set by the typography picker.
 */
export default function SilverInvitation(props: InvitationViewModelProps) {
  const invitation = buildInvitationViewModel(props);
  const { guest, eventToken, tableInfo } = props;
  const tableEnabled = !!tableInfo?.enabled;

  return (
    <div className="inv4-root">
      <PearlDecor fixed />
      <main className="inv4-main">
        <HeroSection invitation={invitation} showFindTable={tableEnabled} />
        <GreetingSection guestName={guest?.guest_name} />
        <FamilySection invitation={invitation} />
        <CountdownSection invitation={invitation} />
        <CeremonySection events={invitation.ceremony_events} />
        <TableSection tableInfo={tableInfo} />
        <GallerySection photos={invitation.gallery_photos.map((p) => p.photo_path)} />
        <LineupSection events={invitation.ceremony_events} />
        <RsvpBlock invitation={invitation} guest={guest} eventToken={eventToken} />
        <NoteSection invitation={invitation} />
        <ContactSection invitation={invitation} />
        <FooterSection invitation={invitation} showTableLink={tableEnabled} />
      </main>
    </div>
  );
}
