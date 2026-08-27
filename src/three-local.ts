import * as THREE from 'three';

declare global {
  interface Window {
    THREE?: typeof THREE;
  }
}

if (typeof window !== 'undefined') {
  window.THREE = THREE;
}

export default THREE;
