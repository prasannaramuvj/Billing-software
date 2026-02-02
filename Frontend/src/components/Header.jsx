export default function Header({ user, onLogout }) {
    return (
        <div className="bg-white shadow p-4 flex justify-between">
            <h1 className="font-semibold">Dashboard</h1>
            <div>
                {user && <span className="mr-4">Hi, {user}</span>}
                <button onClick={onLogout} className="bg-red-500 text-white px-3 py-1 rounded">
                    Logout
                </button>
            </div>
        </div>
    );
}
