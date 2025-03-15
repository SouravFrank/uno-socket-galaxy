
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ThemeToggle from "@/components/ThemeToggle";
import { Crown, CheckCircle2, Users, Share2 } from "lucide-react";

interface GameLobbyProps {
  gameState: any;
  playerId: string | null;
  isHost: boolean | undefined;
  isReady: boolean | undefined;
  canStartGame: boolean;
  showInviteDialog: boolean;
  setShowInviteDialog: (value: boolean) => void;
  toggleReady: () => void;
  startGame: () => void;
  copyInviteLink: () => void;
  gameId: string | undefined;
}

const GameLobby = ({
  gameState,
  playerId,
  isHost,
  isReady,
  canStartGame,
  showInviteDialog,
  setShowInviteDialog,
  toggleReady,
  startGame,
  copyInviteLink,
  gameId
}: GameLobbyProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="grass-morphism p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Game Lobby</h2>
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(true)}
                className="flex items-center gap-2 grass-button"
              >
                <Share2 className="w-4 h-4" />
                Invite Players
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players ({gameState.players.length}/4)
              </h3>
              <div className="divide-y dark:divide-gray-700">
                {gameState.players.map((player) => (
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">Not Ready</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={toggleReady}
                variant={isReady ? "outline" : "default"}
                className={`flex-1 grass-button ${
                  isReady && "bg-green-500/70 hover:bg-green-600/70"
                }`}
              >
                {isReady ? "Ready!" : "Click when ready"}
              </Button>
              {isHost && (
                <Button
                  onClick={startGame}
                  disabled={!canStartGame}
                  className="flex-1 grass-button"
                >
                  Start Game
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="glass-morphism dark:bg-gray-900/80">
          <DialogHeader>
            <DialogTitle>Invite Players</DialogTitle>
            <DialogDescription>
              Share this game code with your friends:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center text-2xl font-mono border border-white/20 dark:bg-black/30">
              {gameId}
            </div>
            <Button onClick={copyInviteLink} className="w-full grass-button">
              Copy Invite Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameLobby;
