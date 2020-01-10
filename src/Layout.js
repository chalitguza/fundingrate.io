import React, { useEffect, useState } from "react";
import { Header, Footer, Assets, Utils } from "./components";
import { Button, Flex, Text, Sidebar, Page, Divider } from "./primitives";
import Pages from "./pages";
import { useWiring, store } from "./libs/wiring";
import posed from "react-pose";

const PosedSidebar = posed(Sidebar)({
  open: {
    width: "auto",
    delayChildren: 100,
    staggerChildren: 100,
    // transition: ({ i }) => ({ delay: i * 50 }),
    opacity: 1
  },
  closed: { width: "0%", opacity: 0 }
});

const SidebarButton = React.forwardRef(({ href, label, onClick }, innerRef) => {
  return (
    <Button
      key={href}
      textAlign="left"
      fontSize={4}
      type="simple"
      onClick={e => onClick(href)}
      ref={innerRef}
    >
      - {label}
    </Button>
  );
});

const PosedSidebarButton = posed(SidebarButton)({
  open: { y: 0, opacity: 1 },
  closed: { y: 20, opacity: 0 }
});

const SideNav = ({ user, links, onClick }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  useEffect(() => {
    if (!open) toggleOpen();
  }, []); //animate on page render

  // useEffect(() => {
  //   setTimeout(toggleOpen, 5000);
  // }, [open]);

  return (
    <PosedSidebar p={open ? 3 : 0} pose={open ? "open" : "closed"}>
      <Flex
        alignItems="center"
        justifyContent="center"
        my={3}
        onClick={e => onClick("/home")}
      >
        <Assets.Logos.MainLogoWhite />
        {/* <Assets.Icons.Popular mr={2} size={28} /> Dashboard */}
      </Flex>
      <Divider />
      {links.map(({ label, href }) => {
        // console.log(user)
        switch (href) {
          case "/authenticate": {
            if (user) return null;
            return (
              <PosedSidebarButton
                key={href}
                href={href}
                label={label}
                onClick={onClick}
              />
            );
          }
          case "/profile": {
            if (!user) return null;
            return (
              <PosedSidebarButton
                key={href}
                href={href}
                label={label}
                onClick={onClick}
              />
            );
          }
          case "/providers": {
            if (!user) return null;
            return (
              <PosedSidebarButton
                key={href}
                href={href}
                label={label}
                onClick={onClick}
              />
            );
          }
          default:
            return (
              <PosedSidebarButton
                key={href}
                href={href}
                label={label}
                onClick={onClick}
              />
            );
        }
      })}
    </PosedSidebar>
  );
};

const Infobar = p => {
  const [state, setState] = useWiring(["userid"]);
  const {me, myWallet} = state

  return (
    <Header heading="v2.0.0">
      {me ? (
        <Flex alignItems="center" justifyContent="center">
          <Assets.Icons.Wallet mx={2} size={20} />
          <Text>{Utils.renderProp(myWallet.balance, 'money')}</Text>
        </Flex>
      ) : (
        <Button type="primary" onClick={e => onClick("/authenticate")}>
          Login / Register
        </Button>
      )}
    </Header>
  );
};

const Layout = ({ children, onClick }) => {
  const [state, setState] = useWiring(["userid"]);
  const user = state.me;

  const links = Object.keys(Pages).reduce((memo, k) => {
    if (k === "NotFound") return memo;
    memo.push({ label: k, href: `/${k.toLowerCase()}` });
    return memo;
  }, []);

  return (
    <Flex
      width={1}
      height={"100%"}
      bg="darkBacking"
      // justifyContent="center"
      alignItems="center"
    >
      <SideNav user={user} links={links} onClick={onClick} />
      <Flex
        flexDirection="column"
        width={1}
        height={"100%"}
        // bg="backing"
        justifyContent="center"
        // alignItems="center"
      >
        <Infobar />
        <Page flex={1}>{children}</Page>
        <Footer />
      </Flex>
    </Flex>
  );
};

export default Layout;
