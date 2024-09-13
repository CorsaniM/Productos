import Link from "next/link";

export default function Sidenav(props: { children: React.ReactNode }) {
  return <ul>{props.children}</ul>;
  return (
    <ul className="list-none p-0 m-0">
      {props.children}
    </ul>
  );
}

export function SidenavSeparator(props: { children: React.ReactNode }) {
  return <ul className=" px-4 pt-3 text-lg font-large">{props.children}</ul>;
  return <li className="px-4 pt-3 text-sm font-medium">{props.children}</li>;
}

export function SidenavItem(props: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className = `w-full flex gap-1 px-5 py-8 items-center
    hover:bg-gray-500 hover:text-gray-900 active:bg-gray-500`;
  
  const content = (
    <>
      <div className="items-center justify-center p-1 mt-1 text-lg font-large">
        {props.icon}
      </div>
      <p className="text block w-full text-left text-md font-semibold ">
        {props.children}
      </p>
    </>
  );

  if (props.href) {
    return (
      <li>
        <Link href={props.href} className={className}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button className={className} onClick={props.onClick}>
        {content}
      </button>
    </li>
  );
}
