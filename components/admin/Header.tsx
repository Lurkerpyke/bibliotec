import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
    return (
        <header className="flex lg:items-end items-start justify-between lg:flex-row flex-col gap-5 sm:mb-10 mb-5">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-slate-600">
                    Bem vindo Novamente! <span className="font-bold">{session?.user?.name}</span>
                </h2>
                <p className="text-sm md:text-base text-slate-500">
                    Esse é o Dashboard do sistema, monitore tudo aqui
                </p>
            </div>
        </header>
    );
};
export default Header;