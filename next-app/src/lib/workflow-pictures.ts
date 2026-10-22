import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function getWorkflowPictures(service: string): (string | null)[] {
  return [1, 2, 3, 4].map((stage) => {
    const filename = ['jpg', 'jpeg', 'png', 'webp'].map((extension) => `${stage}.${extension}`)
      .find((name) => existsSync(join(process.cwd(), 'public', 'assets', 'workflow', service, name)));
    return filename ? `/assets/workflow/${service}/${filename}` : null;
  });
}
