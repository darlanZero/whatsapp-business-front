
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { IUser } from "@/interfaces/IUser";
import { Edit, UserX } from "lucide-react";
import { useState } from "react";

interface UsersTableProps {
  users: IUser[];
  onStatusChange: (userId: number) => void;
}

export const UsersTable = ({ users, onStatusChange }: UsersTableProps) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const toggleUserSelection = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeactivate = (user: IUser) => {
    onStatusChange(user.id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="p-2 sm:p-3 font-semibold text-gray-900">
              <Checkbox className="flex shrink-0" />
            </th>
            <th className="p-2 sm:p-3 font-semibold text-gray-900">Nome</th>
            <th className="p-2 sm:p-3 font-semibold text-gray-900">Status</th>
            <th className="p-2 sm:p-3 font-semibold text-gray-900">Número de celular</th>
            <th className="p-2 sm:p-3 font-semibold text-gray-900"></th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr
              key={user.id}
              className={`border-b ${user.status === "Inactive" ? "opacity-60" : ""}`}
            >
              <td className="p-2 sm:p-3 text-gray-900 font-semibold">
                <Checkbox
                  className="w-4 h-4 flex shrink-0"
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => toggleUserSelection(user.id)}
                />
              </td>
              <td className="p-2 sm:p-3">
                <div className="flex items-center gap-3 text-gray-900 font-semibold">
                  {/* <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar> */}
                  <span>{user.name}</span>
                </div>
              </td>
              <td className="p-2 sm:p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="p-2 sm:p-3 font-semibold text-gray-900">
                {user.phoneNumber}
              </td>
              <td className="p-2 sm:p-3">
                <div className="flex items-center justify-end gap-2 font-semibold text-gray-900">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white hover:cursor-pointer hover:bg-yellow-400"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar cliente</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p>Edit form would go here.</p>
                        <p>User: {selectedUser?.name}</p>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white hover:bg-red-400 hover:cursor-pointer text-black"
                    onClick={() => handleDeactivate(user)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  
};