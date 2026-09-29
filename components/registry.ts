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
import { directionFieldStates } from "./onboarding/DirectionField/DirectionField.states";
import { noticeStates } from "./onboarding/Notice/Notice.states";
import { generatingStateStates } from "./onboarding/GeneratingState/GeneratingState.states";
import { planTemplateCardStates } from "./onboarding/PlanTemplateCard/PlanTemplateCard.states";
import { wizardStepStates } from "./onboarding/WizardStep/WizardStep.states";
import { welcomeSplitStates } from "./onboarding/WelcomeSplit/WelcomeSplit.states";
import { privacySplashStates } from "./onboarding/PrivacySplash/PrivacySplash.states";
import { answerListStates } from "./onboarding/AnswerList/AnswerList.states";
import { advisorNoteStates } from "./onboarding/AdvisorNote/AdvisorNote.states";
import { thisWeekCardStates } from "./onboarding/ThisWeekCard/ThisWeekCard.states";
import { planTimelineStates } from "./onboarding/PlanTimeline/PlanTimeline.states";
import { storyTextStates } from "./onboarding/StoryText/StoryText.states";
import { revisionChipsStates } from "./onboarding/RevisionChips/RevisionChips.states";
import { answerDrawerStates } from "./onboarding/AnswerDrawer/AnswerDrawer.states";
import { deviceKeyboardStates } from "./onboarding/DeviceKeyboard/DeviceKeyboard.states";
import { goodExampleStates } from "./onboarding/GoodExample/GoodExample.states";
import { guidePageStates } from "./onboarding/GuidePage/GuidePage.states";
import { advisorFileStates } from "./onboarding/AdvisorFile/AdvisorFile.states";
import { pointListStates } from "./onboarding/PointList/PointList.states";
import { reflectionReplyStates } from "./onboarding/ReflectionReply/ReflectionReply.states";
import { recommendationCardStates } from "./onboarding/RecommendationCard/RecommendationCard.states";
import { signalSourcesStates } from "./onboarding/SignalSources/SignalSources.states";
import { draftSectionStates } from "./onboarding/DraftSection/DraftSection.states";
import { storySummaryCardStates } from "./onboarding/StorySummaryCard/StorySummaryCard.states";
import { planSummaryCardStates } from "./onboarding/PlanSummaryCard/PlanSummaryCard.states";
import { storyOutputsStates } from "./onboarding/StoryOutputs/StoryOutputs.states";
import { storyDraftStates } from "./onboarding/StoryDraft/StoryDraft.states";
import { linkedInStepsStates } from "./onboarding/LinkedInSteps/LinkedInSteps.states";
import { linkedInUploadStates } from "./onboarding/LinkedInUpload/LinkedInUpload.states";
import { exportLinksStates } from "./onboarding/ExportLinks/ExportLinks.states";
import { chatMessageStates } from "./chat/ChatMessage/ChatMessage.states";
import { advisorMarkStates } from "./chat/AdvisorMark/AdvisorMark.states";
import { quickRepliesStates } from "./chat/QuickReplies/QuickReplies.states";
import { chatComposerStates } from "./chat/ChatComposer/ChatComposer.states";
import { chatWelcomeStates, introCardStates } from "./chat/ChatWelcome/ChatWelcome.states";
import { loopStatusStates } from "./loop/LoopStatus/LoopStatus.states";
import { destinationStubStates } from "./layout/DestinationStub/DestinationStub.states";
import { tabBarStates } from "./navigation/TabBar/TabBar.states";
import { iconLinkStates } from "./navigation/IconLink/IconLink.states";
import { drawerNavStates } from "./navigation/DrawerNav/DrawerNav.states";
import { menuButtonStates } from "./navigation/MenuButton/MenuButton.states";
import { conciergePillStates } from "./navigation/ConciergePill/ConciergePill.states";
import { conciergePanelStates } from "./navigation/ConciergePanel/ConciergePanel.states";
import { loopTrackStates } from "./loop/LoopTrack/LoopTrack.states";
import { outcomeCaptureStates } from "./homepage/OutcomeCapture/OutcomeCapture.states";
import { followUpCardStates } from "./homepage/FollowUpCard/FollowUpCard.states";
import { nextStepCardStates } from "./homepage/NextStepCard/NextStepCard.states";
import { readyCardStates } from "./homepage/ReadyCard/ReadyCard.states";
import { briefingEntryStates } from "./homepage/BriefingEntry/BriefingEntry.states";
import { entryLinkStates } from "./homepage/EntryLink/EntryLink.states";
import { briefingCardStates } from "./homepage/BriefingCard/BriefingCard.states";
import { briefingEditorialStates } from "./homepage/BriefingEditorial/BriefingEditorial.states";
import { accountCardStates } from "./homepage/AccountCard/AccountCard.states";
import { trendLineStates } from "./homepage/TrendLine/TrendLine.states";
import { loopRowStates } from "./homepage/LoopRow/LoopRow.states";
import { recentWorkStates } from "./homepage/RecentWork/RecentWork.states";
import { ringsHeroStates } from "./homepage/RingsHero/RingsHero.states";
import { ringDetailStates } from "./homepage/RingDetail/RingDetail.states";
import { signalActivityStates } from "./homepage/SignalActivity/SignalActivity.states";
import { stageTrackStates } from "./homepage/StageTrack/StageTrack.states";
import { stageActionsStates } from "./homepage/StageActions/StageActions.states";
import { monogramStates } from "./primitives/Monogram/Monogram.states";
import { switchStates } from "./form/Switch/Switch.states";
import { profileHeaderStates } from "./profile/ProfileHeader/ProfileHeader.states";
import { settingsGroupStates } from "./profile/SettingsGroup/SettingsGroup.states";
import { settingsRowStates } from "./profile/SettingsRow/SettingsRow.states";
import { detailPanelStates } from "./profile/DetailPanel/DetailPanel.states";
import { connectionDetailStates } from "./profile/ConnectionDetail/ConnectionDetail.states";
import { exportDetailStates } from "./profile/ExportDetail/ExportDetail.states";
import { deletionDetailStates } from "./profile/DeletionDetail/DeletionDetail.states";
import { checkboxStates } from "./form/Checkbox/Checkbox.states";
import { codeFieldStates } from "./form/CodeField/CodeField.states";
import { providerButtonsStates } from "./login/ProviderButtons/ProviderButtons.states";
import { mailNotificationStates } from "./login/MailNotification/MailNotification.states";
import { signInEmailStates } from "./login/SignInEmail/SignInEmail.states";
import { accountPickerStates } from "./login/AccountPicker/AccountPicker.states";

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
  directionFieldStates,
  noticeStates,
  generatingStateStates,
  planTemplateCardStates,
  wizardStepStates,
  welcomeSplitStates,
  privacySplashStates,
  answerListStates,
  advisorNoteStates,
  thisWeekCardStates,
  planTimelineStates,
  storyTextStates,
  revisionChipsStates,
  planSummaryCardStates,
  draftSectionStates,
  signalSourcesStates,
  guidePageStates,
  goodExampleStates,
  answerDrawerStates,
  deviceKeyboardStates,
  advisorFileStates,
  pointListStates,
  reflectionReplyStates,
  recommendationCardStates,
  storySummaryCardStates,
  storyOutputsStates,
  storyDraftStates,
  linkedInStepsStates,
  linkedInUploadStates,
  exportLinksStates,
  chatMessageStates,
  advisorMarkStates,
  quickRepliesStates,
  chatComposerStates,
  chatWelcomeStates,
  introCardStates,
  loopStatusStates,
  destinationStubStates,
  tabBarStates,
  iconLinkStates,
  drawerNavStates,
  menuButtonStates,
  conciergePillStates,
  conciergePanelStates,
  loopTrackStates,
  outcomeCaptureStates,
  followUpCardStates,
  nextStepCardStates,
  readyCardStates,
  briefingEntryStates,
  entryLinkStates,
  briefingCardStates,
  briefingEditorialStates,
  accountCardStates,
  trendLineStates,
  loopRowStates,
  recentWorkStates,
  ringsHeroStates,
  ringDetailStates,
  signalActivityStates,
  stageTrackStates,
  stageActionsStates,
  monogramStates,
  switchStates,
  profileHeaderStates,
  settingsGroupStates,
  settingsRowStates,
  detailPanelStates,
  connectionDetailStates,
  exportDetailStates,
  deletionDetailStates,
  checkboxStates,
  codeFieldStates,
  providerButtonsStates,
  mailNotificationStates,
  signInEmailStates,
  accountPickerStates,
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
