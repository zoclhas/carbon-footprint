import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="min-h-[4rem] border-t border-[hsl(var(--nextui-divider)/var(--nextui-divider-opacity,1))] flex items-center justify-center mt-6 text-2xl font-medium">
      <Link href="/">&copy;&nbsp;CarbTrkr</Link>
    </footer>
  );
};
