<?php

namespace App\Component;

use App\Exception\ConstraintValidationException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;

final class RequestParamConverter implements ParamConverterInterface
{
    private const REQUEST_DTO_NAMESPACE_PART = 'App\\DTO\\Request\\';

    /**
     * @var RequestMapper
     */
    private RequestMapper $requestMapper;

    /**
     * @param RequestMapper $requestMapper
     */
    public function __construct(RequestMapper $requestMapper)
    {
        $this->requestMapper = $requestMapper;
    }

    /**
     * @inheritDoc
     * @throws ConstraintValidationException
     */
    public function apply(Request $request, ParamConverter $configuration)
    {
        $request->attributes->set(
            $configuration->getName(),
            $this->requestMapper->toDto(
                $configuration->getClass(),
                $request->getContent()
            )
        );
    }

    /**
     * @inheritDoc
     */
    public function supports(ParamConverter $configuration): bool
    {
        return \class_exists($configuration->getClass()) && \strpos($configuration->getClass(), self::REQUEST_DTO_NAMESPACE_PART) !== false;
    }
}
