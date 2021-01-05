import { IToastProps, Toaster } from "@blueprintjs/core";
import styles from "./toaster.module.scss";

const toast = Toaster.create({ className: styles.globalToaster });

export function showToast(props: IToastProps) {
    toast?.show(props);
}
