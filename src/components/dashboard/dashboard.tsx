// "use client";
// import React from 'react';
// import { NumeroGrande, Subtitle } from '../ui/title';
// import {  RouterOutputs } from '~/trpc/react';

// export default function Dashboard({
//   tickets,
// }: {
//   tickets: NonNullable<RouterOutputs["tickets"]["list"]>;
// }) {
//   // const { data: tickets } = api.tickets.getByUser.useQuery({ userName: user?.fullName ?? '' });
//   // Manejo de tickets
//   // const ticketpend = tickets?.filter((pend) => pend.state === "Pendiente");
//   // const ticketEspera = tickets?.filter((pend) => pend.state === "En espera");
//   // const ticketRechazado = tickets?.filter((pend) => pend.state === "Rechazado");
//   // const ticketasig = tickets?.filter((asig) => asig.state === "En curso");
//   // const ticketfin = tickets?.filter((fin) => fin.state === "Finalizado");


//   return (
//     <div className='flex flex-auto p-2 border-solid border-2 border-gray-400 bg-gray-800 hover:bg-gray-700'>
//       <h1 className="flex basis-1/12 text-lg font-semibold justify-center place-self-center">Tickets</h1>
//       <div className='basis-1/3 place-content-center'>
//         <NumeroGrande>{ticketpend?.length ?? 0}</NumeroGrande>
//         <Subtitle>Pendientes</Subtitle>
//       </div>
//       <div className='basis-1/3 place-content-center'>
//         <NumeroGrande>{ticketEspera?.length ?? 0}</NumeroGrande>
//         <Subtitle>En espera</Subtitle>
//       </div>
//       <div className='basis-1/3 place-content-center'>
//         <NumeroGrande>{ticketasig?.length ?? 0}</NumeroGrande>
//         <Subtitle>En curso</Subtitle>
//       </div>
//       <div className='basis-1/3 place-content-center'>
//         <NumeroGrande>{ticketfin?.length ?? 0}</NumeroGrande>
//         <Subtitle>Finalizados</Subtitle>
//       </div>
//       <div className='basis-1/3 place-content-center'>
//         <NumeroGrande>{ticketRechazado?.length ?? 0}</NumeroGrande>
//         <Subtitle>Rechazado</Subtitle>
//       </div>
//     </div>
//   );
// }
