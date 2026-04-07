// folder-niveles.interface.ts
export interface FolderNiveles {
  name: string;
  expanded?: boolean;
  children: FolderNiveles[]; // 🔥 SIEMPRE array
}
