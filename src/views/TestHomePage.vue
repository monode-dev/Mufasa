<script>
import { ref, computed, defineComponent } from 'vue';
import { SplashScreen } from '@capacitor/splash-screen';
SplashScreen.hide();

export default {
  // components: {
  //   AppBar: defineComponent({
  //     render: () => {
  //       return (
  //         <box
  //           width="1f"
  //           padding={0.5}
  //           background="red"
  //           textSize={1.5}
  //           textColor="#ffffff"
  //           shadowSize={1.5}
  //           shadowDirection={this.$align.bottomCenter}
  //           zIndex={10}
  //         >
  //           App Bar
  //         </box>
  //       );
  //     },
  //   }),
  // },
  computed: {
    pageSty() {
      return {
        width: `100%`,
        height: `100%`,
        background: `#f9fafdff`,
        align: this.$align.topCenter,
      };
    },
    appBarSty() {
      return {
        width: `1f`,
        padding: 0.5,
        background: `red`,
        textSize: 1.5,
        textColor: `#ffffff`,
        shadowSize: 1.5,
        shadowDirection: this.$align.bottomCenter,
        zIndex: 10,
      };
    },
    bodySty() {
      return {
        width: `1f`,
        height: `1f`,
        axis: `stack`,
      };
    },
    floatingContainerSty() {
      return {
        width: `1f`,
        height: `1f`,
        align: this.$align.bottomRight,
        padding: 1,
        spacing: 1,
        zIndex: 10,
        isInteractable: false,
      };
    },
    contentSty() {
      return {
        width: `1f`,
        height: `1f`,
        align: this.$align.topCenter,
        padding: 1,
        spacing: 1,
        overflowY: `scroll`,
      };
    },
    entrySty() {
      return {
        width: `1f`,
        textSize: 1.25,
        spacing: `space-between`,
        axis: `row`,
      };
    },
    iconSty() {
      return {
        width: 1,
        height: 1,
        background: `#888888`,
      };
    },
    buttonSty() {
      return {
        width: 3,
        height: 3,
        cornerRadius: 1.5,
        background: `red`,
        textSize: 2,
        textColor: `#ffffff`,
        shadowSize: 1,
      };
    }
  },
}

</script>
<template>
  <box :sty="pageSty">
    <!-- App Bar -->
    <box :sty="appBarSty">
      App Bar
    </box>

    <!-- Body -->
    <box :sty="bodySty">
      <box :sty="contentSty">
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
        <box :sty="entrySty">Entry A <box :sty="iconSty" /></box>
      </box>
      <box :sty="floatingContainerSty">
        <box :sty="buttonSty">
          A
        </box>
      </box>
    </box>
  </box>
</template>
