
import { Button } from "@/components/ui/button";
import { Share2, Crown, CheckCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GameLobbyProps {
  gameId: string;
  players: any[];
  isHost: boolean;
  isReady: boolean;
  canStartGame: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
  onCopyInviteLink: () => void;
  showInviteDialog: boolean;
  setShowInviteDialog: (show: boolean) => void;
}

const GameLobby = ({
  gameId,
  players,
  isHost,
  isReady,
  canStartGame,
  onToggleReady,
  onStartGame,
  onCopyInviteLink,
  showInviteDialog,
  setShowInviteDialog,
}: GameLobbyProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Game Lobby</h2>
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(true)}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Invite Players
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players ({players.length}/4)
              </h3>
              <div className="divide-y dark:divide-gray-700">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {player.isHost && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                      <span>{player.name}</span>
                    </div>
                    {player.isReady ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-sm text-gray-500">Not Ready</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onToggleReady}
                variant={isReady ? "outline" : "default"}
                className={cn(
                  "flex-1",
                  isReady && "bg-green-500 hover:bg-green-600"
                )}
              >
                {isReady ? "Ready!" : "Click when ready"}
              </Button>
              {isHost && (
                <Button
                  onClick={onStartGame}
                  disabled={!canStartGame}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Start Game
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Players</DialogTitle>
            <DialogDescription>
              Share this game code with your friends:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-2xl font-mono">
              {gameId}
            </div>
            <Button onClick={onCopyInviteLink} className="w-full">
              Copy Invite Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameLobby;
