import {
  LinkedinLogoIcon,
  InstagramLogoIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Socials() {
  return (
    <div>
      <Link
        href="https://github.com/shencan03"
        target="_blank"
        rel="noreferrer noopener"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <GithubLogoIcon size={32} />
      </Link>
      <Link
        href="https://www.instagram.com/huseyin_sencann"
        target="_blank"
        rel="noreferrer noopener"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <InstagramLogoIcon size={32} />
      </Link>
      <Link
        href="https://www.linkedin.com/in/huseyinmehmetsencan"
        target="_blank"
        rel="noreferrer noopener"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <LinkedinLogoIcon size={32} />
      </Link>
    </div>
  );
}
