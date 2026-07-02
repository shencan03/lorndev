import { SignOutIcon } from "@phosphor-icons/react/ssr";

export function SignoutButton() {
  return (
    <button type="submit" className="cursor-pointer">
      <SignOutIcon
        className="w-[16px] h-[16px] sm:w-[24px] sm:h-[24px]"
        color="red"
      />
    </button>
  );
}
