import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Calendar,
    Mail,
    Book,
    User,
    Library,
    Clock,
    CheckCircle,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { markBorrowRecordReturned } from "@/lib/admin/actions/admin-borrow-record-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getBorrowRecord } from "@/lib/admin/actions/borrow-records-details";

const Page = async ({ params }: { params: { id: string } }) => {
    const record = await getBorrowRecord(params.id);

    if (!record) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/borrow-records">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Registro de Empréstimo Não Encontrado</h1>
                </div>
                <Card className="bg-gray-100">
                    <CardContent className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                            <p className="text-xl font-medium text-gray-700">
                                Registro não encontrado
                            </p>
                            <p className="text-gray-500">
                                O registro de empréstimo que você procura não existe ou foi removido
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/admin/borrow-records">
                                    Voltar para Registros de Empréstimo
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusBadge = record.status === "RETURNED" ? (
        <Badge variant="default" className="bg-green-600 text-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            Devolvido
        </Badge>
    ) : record.isOverdue ? (
        <Badge variant="destructive">
            <Clock className="h-4 w-4 mr-2" />
            Atrasado
        </Badge>
    ) : (
        <Badge variant="secondary">
            <Clock className="h-4 w-4 mr-2" />
            Ativo
        </Badge>
    );

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button size="icon" asChild variant='outline' className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                    <Link href="/admin/borrow-records">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-blue-300">Detalhes do Empréstimo</h1>
                    <p className="text-gray-600">
                        Informações detalhadas sobre esta atividade de empréstimo
                    </p>
                </div>
                <div className="ml-auto">{statusBadge}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Book Information */}
                <Card className="lg:col-span-1 bg-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Book className="h-5 w-5 text-blue-500" />
                            Informações do Livro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-4">
                            <div className="bg-gray-200 border rounded-lg w-16 h-24 flex items-center justify-center">
                                <Book className="h-8 w-8 text-gray-500" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{record.bookTitle}</h2>
                                <p className="text-gray-600">{record.bookAuthor}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-blue-800">{record.bookGenre}</Badge>
                                    <Badge variant="outline" className="text-blue-800">
                                        {record.bookTotalCopies} cópias
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Borrower Information */}
                <Card className="lg:col-span-1 bg-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-green-500" />
                            Informações do Usuário
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="font-medium text-sm text-gray-500">
                                    Nome Completo
                                </div>
                                <div className="font-medium">{record.userName}</div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="font-medium text-sm text-gray-500 flex items-center gap-1">
                                        <Mail className="h-4 w-4" /> Email
                                    </div>
                                    <div className="font-medium">{record.userEmail}</div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm text-gray-500">
                                        ID Universitário
                                    </div>
                                    <div className="font-medium">{record.userUniversityId}</div>
                                </div>
                            </div>

                            <div>
                                <div className="font-medium text-sm text-gray-500">
                                    Status da Conta
                                </div>
                                <Badge
                                    variant={
                                        record.userStatus === "APPROVED"
                                            ? "default"
                                            : record.userStatus === "PENDING"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {record.userStatus}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Borrow Information */}
                <Card className="lg:col-span-1 bg-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Library className="h-5 w-5 text-amber-500" />
                            Detalhes do Empréstimo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="font-medium text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" /> Data do Empréstimo
                                    </div>
                                    <div className="font-medium">
                                        {format(record.borrowDate, "MMM dd, yyyy")}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-medium text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" /> Data de Vencimento
                                    </div>
                                    <div className="font-medium">
                                        {format(record.dueDate, "MMM dd, yyyy")}
                                    </div>
                                </div>
                            </div>

                            {record.returnDate && (
                                <div>
                                    <div className="font-medium text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" /> Data de Devolução
                                    </div>
                                    <div className="font-medium">
                                        {format(record.returnDate, "MMM dd, yyyy")}
                                    </div>
                                </div>
                            )}

                            {record.isOverdue && record.status !== "RETURNED" && (
                                <Alert variant="destructive">
                                    <Clock className="h-5 w-5" />
                                    <AlertTitle>Atrasado!</AlertTitle>
                                    <AlertDescription>
                                        Este livro está {Math.ceil(
                                            (new Date().getTime() - record.dueDate.getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )} dias atrasado. Considere entrar em contato com o usuário.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {record.status === "BORROWED" && !record.isOverdue && (
                                <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                                    <Clock className="h-5 w-5 text-blue-700" />
                                    <AlertTitle>Empréstimo Ativo</AlertTitle>
                                    <AlertDescription>
                                        Vence em {Math.ceil(
                                            (record.dueDate.getTime() - new Date().getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )} dias. O livro deve ser devolvido até a data de vencimento.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {record.status === "RETURNED" && (
                                <Alert className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                    <AlertTitle>Devolução Concluída</AlertTitle>
                                    <AlertDescription>
                                        Este livro foi devolvido em {format(record.returnDate as Date, "dd/MM/yyyy")}.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 flex gap-3">
                {record.status === "BORROWED" ? (
                    <form action={async (formData: FormData) => {
                        "use server";
                        await markBorrowRecordReturned(formData);
                    }}>
                        <input type="hidden" name="recordId" value={record.id} />
                        <Button type="submit">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Marcar como Devolvido
                        </Button>
                    </form>
                ) : (
                    <Button disabled variant='outline' className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Já Devolvido
                    </Button>
                )}

                <Button asChild variant='outline' className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                    <Link href={`/books/${record.bookId}`}>Ver Detalhes do Livro</Link>
                </Button>
                <Button asChild variant='outline' className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                    <Link href={`/admin/users?search=${record.userEmail}`}>
                        Ver Perfil do Usuário
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default Page;