export async function POST(request: Request) {
  const body = await request.text();

  //fulfill order
  
  // return 200 OK
  return Response.json(null, {status: 200});
}