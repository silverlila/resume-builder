import React from "react";
import { Doc, Section, Text } from "./primitives";

export const ResumeSimple = () => (
  <Doc>
    <Section>
      <Text type="heading" style={{ size: 24, bold: true }}>
        Filan Fisteku
      </Text>
      <Text type="paragraph" style={{ italic: true }}>
        Software Engineer
      </Text>
    </Section>
    <Section spacing={{ top: 20 }}>
      <Text type="heading" style={{ bold: true }}>
        About me
      </Text>
      <Text type="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
        quisquam quasi exercitationem quod tempora laboriosam molestiae libero?
        Ipsam, explicabo odit, quisquam dolorem iusto minima expedita labore
        fuga tempora architecto eum! Lorem ipsum dolor sit amet, consectetur
        adipisicing elit. Repudiandae quisquam quasi exercitationem quod tempora
        laboriosam molestiae libero? Ipsam, explicabo odit, quisquam dolorem
        iusto minima expedita labore fuga tempora architecto eum!
      </Text>
    </Section>
    <Section spacing={{ top: 20 }}>
      <Text type="heading" style={{ bold: true }}>
        Work history
      </Text>
      <Text type="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
        quisquam quasi exercitationem quod tempora laboriosam molestiae libero?
        Ipsam, explicabo odit, quisquam dolorem iusto minima expedita labore
        fuga tempora architecto eum! Lorem ipsum dolor sit amet, consectetur
        adipisicing elit. Repudiandae quisquam quasi exercitationem quod tempora
        laboriosam molestiae libero? Ipsam, explicabo odit, quisquam dolorem
        iusto minima expedita labore fuga tempora architecto eum!
      </Text>
    </Section>
  </Doc>
);
