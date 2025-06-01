import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Header = async () => {

  const session = await auth();
    
  if (!session?.user?.id) redirect("/sign-in");
  
  const isAdmin = await db
      .select({ isAdmin: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .then((res) => res[0]?.isAdmin === "ADMIN");

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex items-center gap-8 justify-between">
        <li>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button>Logout</Button>
          </form>
        </li>
        <li>
          {isAdmin && 
            <Button asChild>
              <Link href='/admin'>
                Admin
              </Link>
            </Button>
          }
        </li>
      </ul>
    </header>
  );
};

export default Header;