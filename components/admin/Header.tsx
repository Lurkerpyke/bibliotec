import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
    return (
        <header className="flex lg:items-end items-start justify-between lg:flex-row flex-col gap-5 sm:mb-10 mb-5">
            <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                    Bem vindo Novamente! {session?.user?.name}
                </h2>
                <p className="text-base text-slate-500">
                    Esse é o Dashboard do sistema, monitore tudo aqui
                </p>
            </div>

            {/*<p>Search</p>*/}
        </header>
    );
};
export default Header;