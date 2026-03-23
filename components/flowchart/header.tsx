'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Menu, HelpCircle, Info, Keyboard, GitBranch } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-sm border-b z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GitBranch className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">LifeMap</h1>
              <p className="text-[10px] text-muted-foreground leading-none">
                Mapa de Decisiones de Vida
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowHelp(true)}>
                <Info className="h-4 w-4 mr-2" />
                Acerca de
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowShortcuts(true)}>
                <Keyboard className="h-4 w-4 mr-2" />
                Atajos de teclado
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ayuda
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* About Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              LifeMap
            </DialogTitle>
            <DialogDescription>
              Una herramienta visual para mapear y explorar tus decisiones de vida.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              LifeMap te permite crear diagramas de flujo interactivos para visualizar diferentes caminos y decisiones en tu vida.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Características:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Crea nodos de decisión con diferentes categorías</li>
                <li>Conecta decisiones con respuestas Sí, No o Tal vez</li>
                <li>Arrastra y organiza tu mapa libremente</li>
                <li>Zoom y navegación fluida</li>
                <li>Exporta e importa tus mapas</li>
                <li>Guardado automático en el navegador</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atajos de Teclado</DialogTitle>
            <DialogDescription>
              Accesos rápidos para trabajar más eficientemente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Eliminar nodo/conexión seleccionada</span>
              <div className="flex gap-1">
                <Kbd>Delete</Kbd>
                <span className="text-muted-foreground">o</span>
                <Kbd>Backspace</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Deseleccionar</span>
              <Kbd>Esc</Kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Zoom</span>
              <div className="flex gap-1">
                <Kbd>Ctrl</Kbd>
                <span className="text-muted-foreground">+</span>
                <Kbd>Scroll</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Pan/Mover canvas</span>
              <span className="text-muted-foreground">Arrastrar con mouse</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Editar texto</span>
              <span className="text-muted-foreground">Doble clic en nodo</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cambiar tipo de conexión</span>
              <span className="text-muted-foreground">Clic en etiqueta</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
