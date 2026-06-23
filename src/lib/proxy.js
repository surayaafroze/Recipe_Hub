// import { headers } from 'next/headers';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server'
import { auth } from './auth';

export async function proxy(request) {
  const session=await auth.api.getSession({
    
    headers: await headers() 
});
const userr = session?.user
console.log(userr,"user login")
 if (!session) {
  return NextResponse.redirect(new URL('/login', request.url));
}
}
 
export const config = {
  matcher:[]
}