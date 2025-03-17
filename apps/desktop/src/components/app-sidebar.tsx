import {
	Sidebar,
	SidebarContent,
	SidebarRail,
	useSidebar,
} from "@popcorntime/ui/components/sidebar";
import * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { groups, header, footer, open } = useSidebar();
	return open ? (
		<Sidebar collapsible="icon" {...props}>
			{header}
			<SidebarContent>
				{groups.map((group, idx) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static group
					<React.Fragment key={idx}>{group}</React.Fragment>
				))}
			</SidebarContent>
			{footer}

			<SidebarRail />
		</Sidebar>
	) : null;
}
