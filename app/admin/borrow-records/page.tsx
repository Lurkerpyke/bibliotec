import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Search } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getBorrowRecords } from "@/lib/admin/actions/admin-borrow-records";

const Page = async ({
    searchParams,
}: {
    searchParams?: {
        status?: "BORROWED" | "RETURNED" | "OVERDUE";
        search?: string;
    };
}) => {
    const status = searchParams?.status || undefined;
    const search = searchParams?.search || undefined;
    const records = await getBorrowRecords(status, search);

    // Stats calculations
    const totalRecords = records.length;
    const activeRecords = records.filter(r => r.status === "BORROWED").length;
    const overdueRecords = records.filter(r => r.isOverdue).length;
    const returnedRecords = records.filter(r => r.status === "RETURNED").length;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Registros de Empréstimo</h1>
                    <p className="text-gray-600 mt-2">
                        Gerencie e acompanhe todas as atividades de empréstimo de livros
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-blue-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Registros Totais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRecords}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-amber-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Empréstimos Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeRecords}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-rose-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overdueRecords}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-emerald-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Devolvidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{returnedRecords}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="bg-gray-100">
                <CardContent className="p-6">
                    <form className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                name="search"
                                placeholder="Buscar por livro, usuário ou email..."
                                className="pl-10"
                                defaultValue={search}
                            />
                        </div>

                        <div className="flex gap-4">
                            <Select name="status" defaultValue={status}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Registros</SelectItem>
                                    <SelectItem value="BORROWED">Ativos</SelectItem>
                                    <SelectItem value="RETURNED">Devolvidos</SelectItem>
                                    <SelectItem value="OVERDUE">Atrasados</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button type="submit" variant='outline' className="bg-blue-100 text-blue-500 hover:bg-blue-200">Aplicar Filtros</Button>

                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Exportar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Records Table */}
            <Card className="bg-gray-100">
                <CardHeader>
                    <CardTitle>Histórico de Empréstimos</CardTitle>
                    <CardDescription>
                        {records.length} registros encontrados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-black">Livro</TableHead>
                                <TableHead className="text-black">Usuário</TableHead>
                                <TableHead className="text-black">Data do Empréstimo</TableHead>
                                <TableHead className="text-black">Data de Vencimento</TableHead>
                                <TableHead className="text-black">Data de Devolução</TableHead>
                                <TableHead className="text-black">Status</TableHead>
                                <TableHead className="text-right text-black">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.length > 0 ? (
                                records.map((record) => {
                                    const isReturned = record.status === "RETURNED";

                                    return (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">
                                                {record.bookTitle}
                                            </TableCell>
                                            <TableCell>
                                                <div>{record.userName}</div>
                                                <div className="text-sm text-gray-500">
                                                    {record.userEmail}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {format(record.borrowDate, "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {format(record.dueDate, "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {record.returnDate
                                                    ? format(record.returnDate, "MMM dd, yyyy")
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {isReturned ? (
                                                    <Badge variant="default">Devolvido</Badge>
                                                ) : record.isOverdue ? (
                                                    <Badge variant="destructive">Atrasado</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Ativo</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/admin/borrow-records/${record.id}`}>
                                                        Ver Detalhes
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                            <p className="text-gray-500 font-medium">
                                                Nenhum registro de empréstimo encontrado
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Tente ajustar sua busca ou os filtros
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;