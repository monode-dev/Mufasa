import { InlineAppBar } from "@/components/InlineAppBar";
import { SimpleBody } from "@/components/SimpleBody";
import { SimplePage } from "@/components/SimplePage";
import { Txt, theme } from "miwi";

export function PrivacyPolicyPage() {
  const titleStyle = {
    scale: 1.1875,
    boldText: true,
    padTop: 1,
  };
  return (
    <SimplePage>
      <InlineAppBar name="Privacy Policy" />
      <SimpleBody padBetween={0.5} stroke={theme.palette.hint}>
        <Txt widthGrows alignCenterLeft>
          Last updated: April 6, 2024
        </Txt>
        <Txt widthGrows alignCenterLeft>
          Welcome to Ninety Percent! We are committed to protecting
          the privacy and security of our users. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          use our application.
        </Txt>
        <Txt {...titleStyle}>Information We Collect</Txt>
        {/** Information Collection and Handling */}
        <Txt widthGrows alignCenterLeft>
          We collect personal information, content related to your clients'
          assets, and usage information. Personally identifiable information may
          include, but is not limited to:
        </Txt>
        <Txt widthGrows alignCenterLeft>
          <ul style={{ margin: 0 }}>
            <li>First name and last name</li>
            <li>Email address</li>
            <li>Employer</li>
            <li>User-generated data</li>
            <li>Usage data</li>
          </ul>
        </Txt>
        <Txt {...titleStyle}>How We Use Your Information</Txt>
        <Txt widthGrows alignCenterLeft>
          To provide and improve our app, manage your account, research, and
          communicate with you.
        </Txt>
        <Txt {...titleStyle}>How We Share Your Information</Txt>
        <Txt widthGrows alignCenterLeft>
          Your information is stored in Firebase Storage and Firestore, and
          managed through Firebase Auth. We do not sell your data to third
          parties.
        </Txt>
        <Txt {...titleStyle}>Your Choices About Your Information</Txt>
        <Txt widthGrows alignCenterLeft>
          You can review, change, or delete your personal information through
          the app or by contacting us.
        </Txt>
        <Txt {...titleStyle}>Children's Privacy</Txt>
        {/** Other Details */}
        <Txt widthGrows alignCenterLeft>
          Ninety Percent is not intended for children under 13.
        </Txt>
        <Txt {...titleStyle}>Changes to Our Privacy Policy</Txt>
        <Txt widthGrows alignCenterLeft>
          We may update our Privacy Policy and will notify you of changes.
        </Txt>
        <Txt {...titleStyle}>Contact Us</Txt>
        <Txt
          widthGrows
          alignCenterLeft
          onClick={() =>
            ((window as any).location =
              `mailto:${encodeURIComponent(`info@tke.us`)}?Subject=${encodeURIComponent(`About Ninety Percent Privacy`)}`)
          }
        >
          <span>
            If you have any questions about this Privacy Policy, please contact
            us by email at: <u>info@tke.us</u>
          </span>
        </Txt>
      </SimpleBody>
    </SimplePage>
  );
}
