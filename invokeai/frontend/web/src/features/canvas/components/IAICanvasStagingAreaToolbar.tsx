import { ButtonGroup, Flex } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { saveStagingAreaImageToGallery } from 'app/socketio/actions';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAIIconButton from 'common/components/IAIIconButton';
import { canvasSelector } from 'features/canvas/store/canvasSelectors';
import {
  commitStagingAreaImage,
  discardStagedImages,
  nextStagingAreaImage,
  prevStagingAreaImage,
  setShouldShowStagingImage,
  setShouldShowStagingOutline,
} from 'features/canvas/store/canvasSlice';
import { isEqual } from 'lodash-es';

import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaSave,
} from 'react-icons/fa';

const selector = createSelector(
  [canvasSelector],
  (canvas) => {
    const {
      layerState: {
        stagingArea: { images, selectedImageIndex },
      },
      shouldShowStagingOutline,
      shouldShowStagingImage,
    } = canvas;

    return {
      currentStagingAreaImage:
        images.length > 0 ? images[selectedImageIndex] : undefined,
      isOnFirstImage: selectedImageIndex === 0,
      isOnLastImage: selectedImageIndex === images.length - 1,
      shouldShowStagingImage,
      shouldShowStagingOutline,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);

const IAICanvasStagingAreaToolbar = () => {
  const dispatch = useAppDispatch();
  const {
    isOnFirstImage,
    isOnLastImage,
    currentStagingAreaImage,
    shouldShowStagingImage,
  } = useAppSelector(selector);

  const { t } = useTranslation();

  const handleMouseOver = useCallback(() => {
    dispatch(setShouldShowStagingOutline(true));
  }, [dispatch]);

  const handleMouseOut = useCallback(() => {
    dispatch(setShouldShowStagingOutline(false));
  }, [dispatch]);

  useHotkeys(
    ['left'],
    () => {
      handlePrevImage();
    },
    {
      enabled: () => true,
      preventDefault: true,
    }
  );

  useHotkeys(
    ['right'],
    () => {
      handleNextImage();
    },
    {
      enabled: () => true,
      preventDefault: true,
    }
  );

  useHotkeys(
    ['enter'],
    () => {
      handleAccept();
    },
    {
      enabled: () => true,
      preventDefault: true,
    }
  );

  const handlePrevImage = () => dispatch(prevStagingAreaImage());
  const handleNextImage = () => dispatch(nextStagingAreaImage());
  const handleAccept = () => dispatch(commitStagingAreaImage());

  if (!currentStagingAreaImage) return null;

  return (
    <Flex
      pos="absolute"
      bottom={4}
      w="100%"
      align="center"
      justify="center"
      filter="drop-shadow(0 0.5rem 1rem rgba(0,0,0))"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <ButtonGroup isAttached>
        <IAIIconButton
          tooltip={`${t('unifiedCanvas.previous')} (Left)`}
          aria-label={`${t('unifiedCanvas.previous')} (Left)`}
          icon={<FaArrowLeft />}
          onClick={handlePrevImage}
          colorScheme="accent"
          isDisabled={isOnFirstImage}
        />
        <IAIIconButton
          tooltip={`${t('unifiedCanvas.next')} (Right)`}
          aria-label={`${t('unifiedCanvas.next')} (Right)`}
          icon={<FaArrowRight />}
          onClick={handleNextImage}
          colorScheme="accent"
          isDisabled={isOnLastImage}
        />
        <IAIIconButton
          tooltip={`${t('unifiedCanvas.accept')} (Enter)`}
          aria-label={`${t('unifiedCanvas.accept')} (Enter)`}
          icon={<FaCheck />}
          onClick={handleAccept}
          colorScheme="accent"
        />
        <IAIIconButton
          tooltip={t('unifiedCanvas.showHide')}
          aria-label={t('unifiedCanvas.showHide')}
          data-alert={!shouldShowStagingImage}
          icon={shouldShowStagingImage ? <FaEye /> : <FaEyeSlash />}
          onClick={() =>
            dispatch(setShouldShowStagingImage(!shouldShowStagingImage))
          }
          colorScheme="accent"
        />
        <IAIIconButton
          tooltip={t('unifiedCanvas.saveToGallery')}
          aria-label={t('unifiedCanvas.saveToGallery')}
          icon={<FaSave />}
          onClick={() =>
            dispatch(
              saveStagingAreaImageToGallery(currentStagingAreaImage.image.url)
            )
          }
          colorScheme="accent"
        />
        <IAIIconButton
          tooltip={t('unifiedCanvas.discardAll')}
          aria-label={t('unifiedCanvas.discardAll')}
          icon={<FaPlus style={{ transform: 'rotate(45deg)' }} />}
          onClick={() => dispatch(discardStagedImages())}
          colorScheme="error"
          fontSize={20}
        />
      </ButtonGroup>
    </Flex>
  );
};

export default IAICanvasStagingAreaToolbar;
