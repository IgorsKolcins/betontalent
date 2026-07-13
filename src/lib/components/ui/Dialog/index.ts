export { default as Dialog } from './Dialog.svelte';
export { default as DialogClose } from './DialogClose.svelte';
export { default as DialogContent } from './DialogContent.svelte';
export { default as DialogDescription } from './DialogDescription.svelte';
export { default as DialogOverlay } from './DialogOverlay.svelte';
export { default as DialogPortal } from './DialogPortal.svelte';
export { default as DialogTitle } from './DialogTitle.svelte';
export { default as DialogTrigger } from './DialogTrigger.svelte';

export type DialogCloseProps = DialogPrimitive.CloseProps;
export type DialogContentProps = DialogPrimitive.ContentProps;
export type DialogDescriptionProps = DialogPrimitive.DescriptionProps;
export type DialogOverlayProps = DialogPrimitive.OverlayProps;
export type DialogPortalProps = DialogPrimitive.PortalProps;
export type DialogProps = DialogPrimitive.RootProps;
export type DialogTitleProps = DialogPrimitive.TitleProps;
export type DialogTriggerProps = DialogPrimitive.TriggerProps;
import type { Dialog as DialogPrimitive } from 'bits-ui';
