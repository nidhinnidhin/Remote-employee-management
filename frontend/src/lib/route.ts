// import { NextResponse } from "next/server";
// import axios from "axios";
// import { getSession } from "@/lib/iron-session/getSession";

// export async function GET() {
//   const session = await getSession();

//   console.log("SESSION IN API:", session);

//   const accessToken = session.accessToken;

//   if (!accessToken) {
//     return NextResponse.json(
//       { message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const response = await axios.get(
//     "http://localhost:4000/api/super-admin/companies",
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   return NextResponse.json(response.data);
// }
