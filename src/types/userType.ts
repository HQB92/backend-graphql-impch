interface userType {
    id: number;
    username: string;
    password: string;
    email: string;
    rut: string;
    roles: [string];
}

export default userType;