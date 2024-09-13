export function Title(props: { children: React.ReactNode }) {
  return <h2 className="flex text-xl font-semibold justify-center">{props.children}</h2>;
}
export function Subtitle(props: { children: React.ReactNode }) {
  return <h2 className="flex text-lg font-semibold justify-center">{props.children}</h2>;
}
export function NumeroGrande(props: { children: React.ReactNode }) {
  return <h2 className="flex text-3xl font-bold justify-center">{props.children}</h2>;
}