import { AssetListCategory } from './AssetListCategory';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledAssetListCategory = styled(AssetListCategory)`
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

// == components ===================================================================================
export function AssetList({ className }: {
  className?: string;
}) {
  return (
    <Root
      className={className}
    >
      <StyledAssetListCategory
        title="Shaders"
        dir="shaders"
      />
      <StyledAssetListCategory
        title="Samples"
        dir="samples"
      />
      <StyledAssetListCategory
        title="Wavetables"
        dir="wavetables"
      />
      <StyledAssetListCategory
        title="Images"
        dir="images"
      />
    </Root>
  );
}
