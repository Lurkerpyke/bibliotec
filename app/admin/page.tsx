// app/admin/page.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Book, User, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/admin/actions/admin-dashboard";
import { SendNoticesButton } from "@/components/SendNoticesButton";

const Page = async () => {
    const {
        userCounts,
        bookStats,
        borrowStats,
        recentPendingUsers,
        overdueBooks
    } = await getDashboardData();

    const getUserCount = (status: string) =>
        userCounts.find(uc => uc.status === status)?.count || 0;

    const getBorrowCount = (status: string) =>
        borrowStats.find(bs => bs.status === status)?.count || 0;

    const totalUsers = getUserCount("PENDING") + getUserCount("APPROVED") + getUserCount("REJECTED");
    const totalBorrows = getBorrowCount("BORROWED") + getBorrowCount("RETURNED");

    return (
        <div className="md:p-6 space-y-6">
            <div className="flex justify-between  flex-col md:flex-row gap-5 md:gap-8">
                <div>
                    <h1 className="text-2xl md:text-2xl font-bold text-gray-900">Dashboard De Administrador</h1>
                    <p className="text-gray-600 text-sm md:text-base mt-2">
                        Controle seu sistema de gerenciamento
                    </p>
                </div>
                <div className="flex gap-3 flex-col md:flex-row items-start md:items-center">
                    <Button asChild variant='outline' className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                        <Link href="/admin/books/new" className="flex gap-2">
                            <Book className="h-3 w-3" />
                            Novo Livro
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                        <Link href="/admin/users" className="flex gap-2">
                            <User className="h-3 w-3" />
                            Usuários
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-0">
                <Card className="border-l-4 border-blue-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
                        <User className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="default" className="px-2 py-0.5 bg-blue-200 text-blue-600">
                                Aprovados: {getUserCount("APPROVED")}
                            </Badge>
                            <Badge variant="destructive" className="px-2 py-0.5 bg-blue-200 text-blue-600">
                                Pendente: {getUserCount("PENDING")}
                            </Badge>
                            <Badge variant="destructive" className="px-2 py-0.5">
                                Rejeitado: {getUserCount("REJECTED")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-emerald-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Inventário De Livros</CardTitle>
                        <Book className="h-5 w-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookStats.totalBooks}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="default" className="px-2 py-0.5 bg-green-200 text-green-600">
                                Copias: {bookStats.totalCopies}
                            </Badge>
                            <Badge variant="default" className="px-2 py-0.5 bg-green-200 text-green-600">
                                Disponível: {bookStats.availableCopies}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-amber-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Registro de Empréstimo</CardTitle>
                        <BarChart3 className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBorrows}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="destructive" className="px-2 py-0.5">
                                Ativos: {getBorrowCount("BORROWED")}
                            </Badge>
                            <Badge variant="default" className="px-2 py-0.5 bg-amber-200 text-amber-600">
                                Retornados: {getBorrowCount("RETURNED")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-rose-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Livros Pendentes</CardTitle>
                        <Clock className="h-5 w-5 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overdueBooks.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {overdueBooks.length > 0 ? "Emita um Aviso" : "Todos os livros foram retornados no prazo"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Users */}
                <Card className="bg-gray-100">
                    <CardHeader className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-sm md:text-base">Aprovações Pendentes</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Usuários esperando por uma verificação
                            </CardDescription>
                        </div>
                        <Button variant="link" className="text-blue-600 text-xs md:text-sm" asChild>
                            <Link href="/admin/users?search=PENDING">Ver Todos</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow >
                                    <TableHead className="text-black text-xs md:text-sm">Usuários</TableHead>
                                    <TableHead className="text-black text-xs md:text-sm">ID</TableHead>
                                    <TableHead className="text-black text-xs md:text-sm">Data</TableHead>
                                    <TableHead className="text-right text-black text-xs md:text-sm">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPendingUsers.length > 0 ? (
                                    recentPendingUsers.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gray-100 border rounded-full w-8 h-8 flex items-center justify-center">
                                                        <span className="text-sm font-medium">
                                                            {user.fullName.split(" ").map(n => n[0]).join("")}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>{user.fullName}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.universityId}</TableCell>
                                            <TableCell>
                                                {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/admin/users?search=${user.email}`}>Review</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CheckCircle className="h-5 md:h-8 w-5 md:w-8 text-green-500" />
                                                <p className="text-gray-500 text-xs md:text-base">Sem Aprovações Pendentes</p>
                                                <p className="text-xs md:text-base text-gray-400">Todos os Usuários foram revisados</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Overdue Books */}
                <Card className="bg-gray-100">
                    <CardHeader className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-sm md:text-base">Livros Pendentes</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Livros que passaram da data de entrega
                            </CardDescription>
                        </div>
                        <Button variant="link" className="text-blue-600 text-xs md:text-sm" asChild>
                            <Link href="/admin/borrow-records?status=OVERDUE">Ver Todos</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-black text-xs md:text-sm">Livro & Aluno</TableHead>
                                    <TableHead className="text-black text-xs md:text-sm">Data de entrega</TableHead>
                                    <TableHead className="text-black text-xs md:text-sm">Dias passados</TableHead>
                                    <TableHead className="text-right text-black text-xs md:text-sm">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {overdueBooks.length > 0 ? (
                                    overdueBooks.map(record => {
                                        const dueDate = new Date(record.dueDate);
                                        const today = new Date();
                                        const diffTime = Math.abs(today.getTime() - dueDate.getTime());
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                        return (
                                            <TableRow key={record.id}>
                                                <TableCell>
                                                    <div className="font-medium">{record.bookTitle}</div>
                                                    <div className="text-sm text-gray-500">
                                                        Pego por: {record.userName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {format(dueDate, "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="destructive" className="px-2.5">
                                                        {diffDays} dias
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/admin/borrow-records/${record.id}`}>Ver</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CheckCircle className="h-5 md:h-8 w-5 md:w-8 text-green-500" />
                                                <p className="text-gray-500 text-xs md:text-base">Sem Livros Pendentes</p>
                                                <p className="text-xs md:text-base text-gray-400">Todos os livros foram retornados</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Book className="h-4 md:h-6 w-4 md:w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm md:text-base">Novo Livro</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">Adicione livros à biblioteca</p>
                            </div>
                        </div>
                        <Button variant='outline' className="mt-4 w-full text-xs md:text-sm bg-blue-100 text-blue-500 hover:bg-blue-200" asChild>
                            <Link href="/admin/books/new">Adicionar Livro</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <Activity className="h-4 md:h-6 w-4 md:w-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm md:text-base">Empréstimos</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">Acompanhe e gerencie registros de empréstimo</p>
                            </div>
                        </div>
                        <Button className="mt-4 w-full text-xs md:text-sm bg-blue-100 text-blue-500 hover:bg-blue-200" variant="outline" asChild>
                            <Link href="/admin/borrow-records">Ver Registros</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-100 p-3 rounded-full">
                                <User className="h-4 md:h-6 w-4 md:w-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm md:text-base">Usuários</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">Gerencie as atividades dos usuários</p>
                            </div>
                        </div>
                        <Button className="mt-4 w-full text-xs md:text-sm bg-blue-100 text-blue-500 hover:bg-blue-200" variant="outline" asChild>
                            <Link href="/admin/users">Gerenciar Usuários</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-100 p-3 rounded-full">
                                <AlertCircle className="h-4 md:h-6 w-4 md:w-6 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm md:text-base">Avisos de Atraso</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">Envie lembretes para livros atrasados</p>
                            </div>
                        </div>
                        <SendNoticesButton />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Page;