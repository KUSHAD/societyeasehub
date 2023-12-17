import Logo from "../site/Logo";
import ProfileContent from "../site/ProfileContent";

export default function PublicNavbar() {
  return (
    <nav className="sticky left-0 top-0 z-10  bg-background shadow-md">
      <div className="flex flex-row px-2 py-3">
        <Logo isPublic />
        <ProfileContent />
      </div>
    </nav>
  );
}
