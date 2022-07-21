<?php

namespace App\Component;

use Symfony\Component\Serializer\Encoder\ContextAwareDecoderInterface;
use Symfony\Component\Serializer\Encoder\ContextAwareEncoderInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;
use Symfony\Component\Serializer\Serializer as BaseSerializer;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class Serializer
 */
final class Serializer implements
    SerializerInterface,
    ContextAwareNormalizerInterface,
    ContextAwareDenormalizerInterface,
    ContextAwareEncoderInterface,
    ContextAwareDecoderInterface
{
    /**
     * @var BaseSerializer
     */
    private BaseSerializer $serializer;

    /**
     * @var array
     */
    private array $context;

    public function __construct(BaseSerializer $serializer)
    {
        $this->serializer = $serializer;
        $this->context[AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER] = static fn(object $object) => $object->getId();
    }

    public function supportsDecoding(string $format, array $context = []): bool
    {
        return $this->serializer->supportsDecoding($format, $this->getContext($context));
    }

    public function supportsDenormalization($data, string $type, string $format = null, array $context = []): bool
    {
        return $this->serializer->supportsDenormalization($data, $type, $format, $this->getContext($context));
    }

    public function supportsEncoding(string $format, array $context = []): bool
    {
        return $this->serializer->supportsEncoding($format, $this->getContext($context));
    }

    public function supportsNormalization($data, string $format = null, array $context = []): bool
    {
        return $this->serializer->supportsNormalization($data, $format, $this->getContext($context));
    }

    public function decode($data, string $format, array $context = [])
    {
        return $this->serializer->decode($data, $format, $this->getContext($context));
    }

    public function denormalize($data, string $class, string $format = null, array $context = [])
    {
        return $this->serializer->denormalize($data, $class, $format, $this->getContext($context));
    }

    public function encode($data, string $format, array $context = [])
    {
        return $this->serializer->encode($data, $format, $this->getContext($context));
    }

    public function normalize($object, string $format = null, array $context = [])
    {
        return $this->serializer->normalize($object, $format, $this->getContext($context));
    }

    public function serialize($data, string $format, array $context = []): string
    {
        return $this->serializer->serialize($data, $format, $this->getContext($context));
    }

    public function deserialize($data, string $type, string $format, array $context = [])
    {
        return $this->serializer->deserialize($data, $type, $format, $this->getContext($context));
    }

    private function getContext(array $context): array
    {
        return \array_merge($context, $this->context);
    }
}
