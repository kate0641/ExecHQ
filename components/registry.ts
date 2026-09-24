/**
 * The component catalogue's only data source.
 *
 * Each entry is the component's own `*.states.ts` file, which imports the real
 * component. The catalogue renders what is here and nothing else, so it cannot
 * show a copy or fall out of date with the component itself.
 *
 * Adding a component to the catalogue: write `X.states.ts` next to it, then add
 * one line to this file.
 */
import { COMPONENT_GROUPS, type ComponentGroup, type RegisteredComponent } from "./types";

import { badgeStates } from "./primitives/Badge/Badge.states";
import { buttonStates } from "./primitives/Button/Button.states";
import { iconStates } from "./primitives/Icon/Icon.states";
import { textLinkStates } from "./primitives/TextLink/TextLink.states";
import { wordmarkStates } from "./primitives/Wordmark/Wordmark.states";
import { inputStates } from "./form/Input/Input.states";
import { toggleGroupStates } from "./form/ToggleGroup/ToggleGroup.states";
import { micButtonStates } from "./form/MicButton/MicButton.states";
import { chipGroupStates } from "./form/ChipGroup/ChipGroup.states";
import { panelStates } from "./layout/Panel/Panel.states";
import { placeholderStateStates } from "./layout/PlaceholderState/PlaceholderState.states";
import { navPlaceholderStates } from "./layout/NavPlaceholder/NavPlaceholder.states";
import { stepBarStates } from "./layout/StepBar/StepBar.states";
import { sheetStates } from "./layout/Sheet/Sheet.states";
import { stepHeaderStates } from "./onboarding/StepHeader/StepHeader.states";
import { stepProgressStates } from "./onboarding/StepProgress/StepProgress.states";
import { stepActionsStates } from "./onboarding/StepActions/StepActions.states";
import { privacyPromiseStates } from "./onboarding/PrivacyPromise/PrivacyPromise.states";
import { directionFieldStates } from "./onboarding/DirectionField/DirectionField.states";
import { interpretedDirectionStates } from "./onboarding/InterpretedDirection/InterpretedDirection.states";
import { refinementQuestionStates } from "./onboarding/RefinementQuestion/RefinementQuestion.states";
import { noticeStates } from "./onboarding/Notice/Notice.states";
import { assumptionNoticeStates } from "./onboarding/AssumptionNotice/AssumptionNotice.states";
import { generatingStateStates } from "./onboarding/GeneratingState/GeneratingState.states";
import { planTemplateCardStates } from "./onboarding/PlanTemplateCard/PlanTemplateCard.states";
import { actionCardStates } from "./onboarding/ActionCard/ActionCard.states";
import { artifactDraftStates } from "./onboarding/ArtifactDraft/ArtifactDraft.states";
import { connectOfferStates } from "./onboarding/ConnectOffer/ConnectOffer.states";
import { wizardStepStates } from "./onboarding/WizardStep/WizardStep.states";
import { threadTurnStates } from "./onboarding/ThreadTurn/ThreadTurn.states";
import { canvasSectionStates } from "./onboarding/CanvasSection/CanvasSection.states";
import { canvasHeaderStates } from "./onboarding/CanvasHeader/CanvasHeader.states";
import { directionDeckStates } from "./onboarding/DirectionDeck/DirectionDeck.states";
import { welcomeSplitStates } from "./onboarding/WelcomeSplit/WelcomeSplit.states";
import { privacySplashStates } from "./onboarding/PrivacySplash/PrivacySplash.states";
import { answerListStates } from "./onboarding/AnswerList/AnswerList.states";
import { advisorNoteStates } from "./onboarding/AdvisorNote/AdvisorNote.states";
import { thisWeekCardStates } from "./onboarding/ThisWeekCard/ThisWeekCard.states";
import { planTimelineStates } from "./onboarding/PlanTimeline/PlanTimeline.states";
import { storyTextStates } from "./onboarding/StoryText/StoryText.states";
import { revisionChipsStates } from "./onboarding/RevisionChips/RevisionChips.states";
import { chatMessageStates } from "./chat/ChatMessage/ChatMessage.states";
import { advisorMarkStates } from "./chat/AdvisorMark/AdvisorMark.states";
import { quickRepliesStates } from "./chat/QuickReplies/QuickReplies.states";
import { chatComposerStates } from "./chat/ChatComposer/ChatComposer.states";
import { chatWelcomeStates, introCardStates } from "./chat/ChatWelcome/ChatWelcome.states";

export const registry: RegisteredComponent[] = [
  badgeStates,
  buttonStates,
  iconStates,
  textLinkStates,
  wordmarkStates,
  inputStates,
  toggleGroupStates,
  micButtonStates,
  chipGroupStates,
  panelStates,
  placeholderStateStates,
  navPlaceholderStates,
  stepBarStates,
  sheetStates,
  stepHeaderStates,
  stepProgressStates,
  stepActionsStates,
  privacyPromiseStates,
  directionFieldStates,
  interpretedDirectionStates,
  refinementQuestionStates,
  noticeStates,
  assumptionNoticeStates,
  generatingStateStates,
  planTemplateCardStates,
  actionCardStates,
  artifactDraftStates,
  connectOfferStates,
  wizardStepStates,
  threadTurnStates,
  canvasSectionStates,
  canvasHeaderStates,
  directionDeckStates,
  welcomeSplitStates,
  privacySplashStates,
  answerListStates,
  advisorNoteStates,
  thisWeekCardStates,
  planTimelineStates,
  storyTextStates,
  revisionChipsStates,
  chatMessageStates,
  advisorMarkStates,
  quickRepliesStates,
  chatComposerStates,
  chatWelcomeStates,
  introCardStates,
];

/** URL-safe id for a component, used for catalogue deep links. */
export function componentId(component: RegisteredComponent): string {
  return component.name.toLowerCase();
}

export function getComponent(id: string): RegisteredComponent | undefined {
  return registry.find((component) => componentId(component) === id);
}

/** The registry grouped by type, in the order declared in `types.ts`, with
 *  empty groups dropped. */
export function registryByGroup(
  components: RegisteredComponent[] = registry
): { group: ComponentGroup; components: RegisteredComponent[] }[] {
  return COMPONENT_GROUPS.map((group) => ({
    group,
    components: components
      .filter((component) => component.group === group)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((entry) => entry.components.length > 0);
}
